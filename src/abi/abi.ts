export const staking = [
    {
        inputs: [],
        name: "allAmoutInStaking",
        outputs:
            [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }
            ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "allAccrued",
        outputs:
            [
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256"
                }
            ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs: [],
        name: "allWithdrawn",
        outputs:
            [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256"
                }
            ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs:
            [
                {
                    internalType: "address",
                    name: "user",
                    type: "address"
                }
            ],
        name: "getUser",
        outputs:
            [
                {
                    components:
                        [
                            {
                                internalType: "uint256",
                                name: "startTime",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "period",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "payPeriod",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "investedAmount",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "withdrawnAmount",
                                type: "uint256"
                            },
                            {
                                internalType: "uint256",
                                name: "withdrawnTime",
                                type: "uint256"
                            }
                        ],
                    internalType: "struct DCA.User[]",
                    name: "",
                    type: "tuple[]"
                }
            ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs:
        [
            {
                internalType: "address",
                name: "user",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "num",
                type: "uint256"
            }
        ],
        name: "getUserAmount",
        outputs:
        [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            }
        ],
        stateMutability: "view",
        type: "function"
    },
    {
        inputs:
        [
            {
                internalType: "uint256",
                name: "amount",
                type: "uint256"
            },
            {
                internalType: "uint256",
                name: "period",
                type: "uint256"
            }
        ],
        name: "addToPool",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    }
] as const

export const usdt = [
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
    },
    {
        inputs: [
        {
            internalType: "address",
            name: "spender",
            type: "address"
        },
        {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
        }],
        name: "approve",
        outputs: [
        {
            internalType: "bool",
            name: "",
            type: "bool"
        }],
        stateMutability: "nonpayable",
        type: "function"
    }
] as const