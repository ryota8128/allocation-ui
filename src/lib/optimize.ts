import { all } from 'axios';

type RtTransfer = {
  fromAccount: number;
  toAccount: number;
  amount: number;
};

export default function optimize(
  regularList: RegularTransfer[],
  temporaryList: TemporaryTransfer[],
  accountList: Account[]
) {
  // regular, temporaryをまとめる
  const rtList: RtTransfer[] = buildRtTransfer(regularList, temporaryList);
  // 全ての項目にid, from, to, amountがあるか確認
  validate(rtList);
  // 経由口座のあるものは経由を確定させる
  const { viaTSList, viaSummary, removedViaRtList } = transferToVia(rtList, accountList);
  // サマリーにまとめる
  const nonViaSummary: Summary = integrate(removedViaRtList);
  // 最適化
  const nonViaTSList: TransferSummary[] = calcTransfers({ ...nonViaSummary });
  // 経由地への振替サマリとそれ以外の振替サマリを合算
  const allTSList: TransferSummary[] = total(viaTSList, nonViaTSList);
  const allSummary: Summary = totalSummary(viaSummary, nonViaSummary);

  return { result: allTSList, summary: allSummary };
}

function buildRtTransfer(
  regularList: RegularTransfer[],
  temporaryList: TemporaryTransfer[]
): RtTransfer[] {
  const rtTransfer1: RtTransfer[] = regularList.map((reg) => {
    return {
      fromAccount: reg.fromAccount,
      toAccount: reg.toAccount,
      amount: reg.amount,
    } as RtTransfer;
  });

  const rtTransfer2: RtTransfer[] = temporaryList.map((temp) => {
    return {
      fromAccount: temp.fromAccount,
      toAccount: temp.toAccount,
      amount: temp.amount,
    } as RtTransfer;
  });

  return [...rtTransfer1, ...rtTransfer2];
}

function validate(rtList: RtTransfer[]) {
  rtList.forEach((rt) => {
    if (!rt.fromAccount || !rt.toAccount || (rt.amount !== 0 && !rt.amount)) {
      console.error('未入力の項目が存在します', rt);
      throw new Error('未入力の項目が存在します');
    }
  });
}

function transferToVia(rtList: RtTransfer[], accountList: Account[]) {
  // key: accountId, val: viaId
  const viaMap: { [key: number]: number } = accountList
    .filter((ac) => ac.via)
    .reduce<{ [key: number]: number }>((acc, account) => {
      const id = account.id as number;
      acc[id] = account.via as number;
      return acc;
    }, {});

  const haveViaAccountId = Object.keys(viaMap).map(Number);

  const viaTSList: TransferSummary[] = [];
  const viaSummary: Summary = {};

  const removedViaRtList = rtList.map((rt) => {
    const haveViaFromAccount = haveViaAccountId.includes(rt.fromAccount);
    const haveViaToAccount = haveViaAccountId.includes(rt.toAccount);
    const notExistVia = !haveViaFromAccount && !haveViaToAccount;

    if (notExistVia) {
      // 経由口座がないときはスキップ
      return rt;
    }

    let newFromAccount = rt.fromAccount;
    let newToAccount = rt.toAccount;

    if (haveViaFromAccount) {
      const viaFrom = rt.fromAccount;
      const viaTo = viaMap[rt.fromAccount];
      calcTransferSummary(viaTSList, viaFrom, viaTo, rt.amount);
      calcSummary(viaSummary, viaFrom, viaTo, rt.amount);
      newFromAccount = viaTo;
    }

    if (haveViaToAccount) {
      const viaFrom = viaMap[rt.toAccount];
      const viaTo = rt.toAccount;
      calcTransferSummary(viaTSList, viaFrom, viaTo, rt.amount);
      calcSummary(viaSummary, viaFrom, viaTo, rt.amount);
      newToAccount = viaFrom;
    }

    return { ...rt, fromAccount: newFromAccount, toAccount: newToAccount };
  });

  return { viaTSList, viaSummary, removedViaRtList };
}

function integrate(rtList: RtTransfer[]) {
  const summary: Summary = {};

  rtList.forEach((rt) => {
    const amount = rt.amount as number;
    const fromId = rt.fromAccount as number;
    const toId = rt.toAccount as number;
    calcSummary(summary, fromId, toId, amount);
  });

  return summary;
}

function calcTransfers(summary: Summary): TransferSummary[] {
  const transfers: TransferSummary[] = [];

  const positiveAccounts: number[] = Object.keys(summary)
    .map(Number)
    .filter((id) => summary[id] > 0)
    .sort((a, b) => summary[a] - summary[b]);

  const negativeAccounts: number[] = Object.keys(summary)
    .map(Number)
    .filter((id) => summary[id] < 0)
    .sort((a, b) => summary[b] - summary[a]);

  while (positiveAccounts.length > 0 && negativeAccounts.length > 0) {
    const fromAccount = negativeAccounts[0];
    const toAccount = positiveAccounts[0];

    const amount = Math.min(Math.abs(summary[fromAccount]), summary[toAccount]);

    summary[fromAccount] += amount;
    summary[toAccount] -= amount;

    transfers.push({ from: fromAccount, to: toAccount, amount });

    if (summary[fromAccount] === 0) {
      negativeAccounts.shift();
    }
    if (summary[toAccount] === 0) {
      positiveAccounts.shift();
    }
  }

  return transfers;
}

function total(viaTSList: TransferSummary[], nonViaTSList: TransferSummary[]) {
  const allTSList: TransferSummary[] = [...nonViaTSList];
  for (const viaTS of viaTSList) {
    calcTransferSummary(allTSList, viaTS.from, viaTS.to, viaTS.amount);
  }
  return allTSList;
}

function totalSummary(viaSummary: Summary, nonViaSummary: Summary) {
  const allSummary: Summary = { ...nonViaSummary };
  const allSumKeys = Object.keys(allSummary).map(Number);

  for (const id of Object.keys(viaSummary).map(Number)) {
    if (allSumKeys.includes(id)) {
      allSummary[id] += viaSummary[id];
    } else {
      allSummary[id] = viaSummary[id];
    }
  }
  return allSummary;
}

function calcTransferSummary(tsList: TransferSummary[], from: number, to: number, amount: number) {
  const findTS = tsList.find((ts) => ts.from === from && ts.to === to);
  const minusFindTS = tsList.find((ts) => ts.from === to && ts.to === from);
  if (findTS) {
    findTS.amount += amount;
  } else if (minusFindTS) {
    minusFindTS.amount -= amount;
    if (minusFindTS.amount < 0) {
      minusFindTS.from = from;
      minusFindTS.to = to;
      minusFindTS.amount = -minusFindTS.amount;
    }
  } else {
    tsList.push({ from, to, amount });
  }
}

function calcSummary(summary: Summary, fromId: number, toId: number, amount: number) {
  if (summary.hasOwnProperty(fromId)) {
    // キーが存在する場合は値を加算
    summary[fromId] -= amount;
  } else {
    // キーが存在しない場合は新しい値を設定
    summary[fromId] = -amount;
  }

  if (summary.hasOwnProperty(toId)) {
    // キーが存在する場合は値を加算
    summary[toId] += amount;
  } else {
    // キーが存在しない場合は新しい値を設定
    summary[toId] = amount;
  }
}
