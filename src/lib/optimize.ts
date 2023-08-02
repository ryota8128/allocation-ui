import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

type RtTransfer = {
  id?: number;
  fromAccount?: number;
  toAccount?: number;
  amount?: number;
};

type Summary = {
  [key: number]: number;
};

export default function optimize(
  regularList: RegularTransfer[],
  temporaryList: TemporaryTransfer[]
) {
  // regular, temporaryをまとめる
  const rtList: RtTransfer[] = buildRtTransfer(regularList, temporaryList);
  // 全ての項目にid, from, to, amountがあるか確認
  validate(rtList);
  // サマリーにまとめる
  const summary: Summary = integrate(rtList);
  console.log(summary);
}

function buildRtTransfer(
  regularList: RegularTransfer[],
  temporaryList: TemporaryTransfer[]
): RtTransfer[] {
  const rtTransfer1: RtTransfer[] = regularList.map((reg) => {
    return {
      id: reg.id,
      fromAccount: reg.fromAccount,
      toAccount: reg.toAccount,
      amount: reg.amount,
    } as RtTransfer;
  });

  const rtTransfer2: RtTransfer[] = temporaryList.map((temp) => {
    return {
      id: temp.id,
      fromAccount: temp.fromAccount,
      toAccount: temp.toAccount,
      amount: temp.amount,
    } as RtTransfer;
  });

  return [...rtTransfer1, ...rtTransfer2];
}

function validate(rtList: RtTransfer[]) {
  rtList.forEach((rt) => {
    if (!rt.fromAccount || !rt.toAccount || !rt.id || (rt.amount !== 0 && !rt.amount)) {
      console.error('未入力の項目が存在します', rt);
      throw new Error('未入力の項目が存在します');
    }
  });
}

function integrate(rtList: RtTransfer[]) {
  const transferSummary: Summary = {};

  rtList.forEach((rt) => {
    const amount = rt.amount as number;
    const fromId = rt.fromAccount as number;
    const toId = rt.toAccount as number;

    if (transferSummary.hasOwnProperty(toId)) {
      // キーが存在する場合は値を加算
      transferSummary[toId] += amount;
    } else {
      // キーが存在しない場合は新しい値を設定
      transferSummary[toId] = amount;
    }

    if (transferSummary.hasOwnProperty(fromId)) {
      // キーが存在する場合は値を加算
      transferSummary[fromId] -= amount;
    } else {
      // キーが存在しない場合は新しい値を設定
      transferSummary[fromId] = -amount;
    }
  });

  return transferSummary;
}
