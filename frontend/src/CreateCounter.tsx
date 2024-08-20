import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button, Container } from "@radix-ui/themes";
import {
  useSignAndExecuteTransactionBlock,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import React from "react";
import { PACKAGE_ID } from "./config/constants";

export function CreateCounter({
  onCreated,
}: {
  onCreated: (id: string) => void;
}) {
  const client = useSuiClient();
  const counterPackageId = PACKAGE_ID;
  
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  return (
    <Container>
      <Button
        size="3"
        onClick={() => {
          create();
        }}
      >
        Create Counter
      </Button>
    </Container>
  );

  function create() {
    const txb = new TransactionBlock();

    txb.moveCall({
      arguments: [
        txb.object("0x8"), // r: &Random
      ],
      target: `${counterPackageId}::randomX::rollDice`,
    });

    signAndExecute(
      {
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      },
      {
        onSuccess: (tx) => {
          console.log('tx: ', tx);
          
          client
            .waitForTransactionBlock({
              digest: tx.digest,
            })
            .then(() => {
              console.log('tx.effects?.created: ', tx.effects?.created);
              
              // const objectId = tx.effects?.created?.[0]?.reference?.objectId;

              // if (objectId) {
              //   onCreated(objectId);
              // }
            });
        },
        onError: (e) => {
          console.error(e);
        },
      },
    );
  }
}
