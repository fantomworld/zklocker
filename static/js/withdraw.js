import {
    useState
} from "react";
import Footer from "./footer";
import Header from "./header";
import withdraw from "./img/withdraw.png";
import connect from "./img/connect.png";
import Abi from "./abi.json";
import {
    ConnectKitProvider,
    ConnectKitButton
} from "connectkit";
import {
    erc20ABI,
    useContractReads,
    useContractWrite,
    usePrepareContractWrite
} from "wagmi";
import {
    ethers
} from "ethers";

const ZKeyContract = {
    address: "0xFcF7576fFB0a9d7C58fABB35dc65A95eCbA201B5",
    abi: Abi
}

function Withdraw() {
    return ( <
        div className = "app" >
        <
        Header / >
        <
        div className = "container" >
        <
        ConnectKitProvider >
        <
        ConnectKitButton.Custom > {
            ({
                isConnected,
                show,
                address,
                ensName
            }) => {
                if (isConnected) {
                    return ( <
                        Content address = {
                            address
                        }
                        />
                    );
                }
                return ( <
                    div className = "form" >
                    <
                    img className = "lock"
                    src = {
                        connect
                    }
                    onClick = {
                        () => {
                            show()
                        }
                    }
                    /> <
                    /div>
                );
            }
        } <
        /ConnectKitButton.Custom> <
        /ConnectKitProvider> <
        /div> <
        Footer / >
        <
        /div>
    )
}
export default Withdraw

function Content(props) {

    const {
        data,
        isLoading,
        error
    } = useContractReads({
        allowFailure: false,
        contracts: [{
            ...ZKeyContract,
            functionName: 'getTokensLockedByUser',
            args: [props.address]
        }, ],
        watch: true
    })
    const lockedTokenRows = []
    if (!isLoading) {
        const lockedTokens = data[0]
        for (var i = 0; i < lockedTokens.length; i++) {
            const tokenAddress = lockedTokens[i][0]
            const amountLocked = lockedTokens[i][1]
            if (amountLocked > 0) {
                lockedTokenRows.push(LockedToken({
                    address: props.address,
                    contractAddress: tokenAddress,
                    amount: amountLocked
                }))
            }
        }
    }
    return ( <
        div className = "withdraw" >
        <
        div className = "title" > Locked Tokens < /div> {
            lockedTokenRows
        } {
            lockedTokenRows.length == 0 && < div className = "form" > You have no locked tokens. < /div>} <
                /div>
        )
    }

    function LockedToken({
        address,
        contractAddress,
        amount
    }) {
        const {
            data,
            isLoading,
            error
        } = useContractReads({
            allowFailure: false,
            contracts: [{
                    abi: erc20ABI,
                    address: contractAddress,
                    functionName: 'name',
                },
                {
                    abi: erc20ABI,
                    address: contractAddress,
                    functionName: 'symbol',
                },
                {
                    abi: erc20ABI,
                    address: contractAddress,
                    functionName: 'decimals',
                },
                {
                    ...ZKeyContract,
                    functionName: 'locks',
                    args: [address, contractAddress]
                }
            ],
            watch: true
        })

        var name = contractAddress.substring(0, 8) + "..."
        var amountETH = amount.toString()
        var symbol = ""
        var canWithdraw = true
        if (!isLoading) {
            name = data[0]
            symbol = data[1]
            amountETH = ethers.utils.formatUnits(amount, data[2])

            const currentDateInSeconds = Math.floor(Date.now() / 1000);
            canWithdraw = currentDateInSeconds > Number(data[3].unlockTimestamp.toString())
        }

        const {
            config,
            error: withdrawError
        } = usePrepareContractWrite({
            ...ZKeyContract,
            functionName: "withdrawSingle",
            args: [contractAddress],
            overrides: {
                from: address,
            },
        })
        const contractWrite = useContractWrite(config)

        return ( <
            div className = "row" >
            <
            a href = "#"
            className = "name" > {
                name
            } < /a> <
            div className = "amount" > {
                amountETH
            } {
                symbol
            } < /div> {
                canWithdraw && < img className = "go"
                src = {
                    withdraw
                }
                onClick = {
                    () => {
                        contractWrite.write()
                    }
                }
                />} <
                /div>
            )
        }