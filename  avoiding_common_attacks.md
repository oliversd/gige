#Avoiding common attacks

- Prevented reentracy attacks for payable function
- Pull withdraw instead of push
- Don't use any timestamp dependency
- State machine for order progress
- Only seller or buyer have permission to modify the order state in each step never the two or a third party.

## Other security measures

- Using SafeMath for all arimetic operations to prevent overflow and underflow results.
- Using transfer instead of send in case of a fail operation the funds are reverted
- Use require and modifiers in the functions that need to check some value or condition
- All the funcions and variable have visibility set
- Use Solcheck as a linter.
- Use battle tested OpenZeppelin libraries.
