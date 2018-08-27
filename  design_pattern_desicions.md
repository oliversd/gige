# Design Pattern desicions

## Libraries, Pause & Destroy

I take advantage of the ETHPM libraries from OpenZeppeling that are battle tested. In particular I use SafeMath, Destructible, Pausable.

With Pausable I assure that no methods that imply modify the state will be called when the Contract is paused. Such as create a order or service or modify the state of a order.

As the Contract functions as a Escrow it’s important that the funds don’t get lost if the contract is killed or destructed. With the Destructible library all the funds are send to the owner if the contract it’s destroyed. This is no the ideal situation but for the time constraints I was not able to create a function to return the funds to each owner. At least this way they are not lost. And we can find a way to return this funds to the owners.

## State Machine

I make use of modifiers to guarantee the correct State of a order before make any modifications. This is important to make sure that the process goes the right way.

For time constraints I was only able to do the “happy path” but I keep the enum and events for the arbitrage in a future.

Right now the process is like this:

1. A seller create a Service
2. A seller create a order with the buyer address
3. The buyer accepts and pays the order and the funds go to the escrow
4. The seller can cancel the order and the funds go back to the seller
5. The seller mark the job as finish
6. The buyer accept the job and is mark as completed.
7. The funds are available for pull payment to the seller.
8. The seller can retrieve his/her available balance.

In the future the seller or the buyer can ask for arbitrage and the person or group in charge decides where the funds go.

# Pull payment

The seller have to withdraw his/her funds there are not sended automatically. This is because:

1. Sending ether back to the seller could run the contract out of gas.
2. Sending ether to unknown addresses could lead to security vulnerabilities.
