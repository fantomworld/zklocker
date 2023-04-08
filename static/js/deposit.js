import {
    useState
} from "react";
import Footer from "./footer";
import Header from "./header";
import lock from "./img/lock.png";
import connect from "./img/connect.png"
import approve from "./img/approve.png"
import Abi from "./abi.json";
import PikadayWrapper from "./pickadaywrapper";
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

function Deposit() {

    return ( <
        div className = "app" >
        <
        Header / >
        <
        div className = "container" >
        Enter the contract and the amount of tokens you wish to lock <
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
        /ConnectKitProvider>

        <
        /div> <
        Footer / >
        <
        /div>
    );
}

export default Deposit;

function Content(props) {

    const [contractAddress, setContractAddress] = useState("");
    const [amountToLock, setAmountToLock] = useState("0");
    const [selectedDate, setSelectedDate] = useState(null);

    const {
        data,
        isLoading,
        error
    } = useContractReads({
        allowFailure: false,
        contracts: [{
                abi: erc20ABI,
                address: contractAddress,
                functionName: 'balanceOf',
                args: [props.address]
            },
            {
                abi: erc20ABI,
                address: contractAddress,
                functionName: 'decimals',
            },
            {
                abi: erc20ABI,
                address: contractAddress,
                functionName: 'allowance',
                args: [props.address, ZKeyContract.address]
            },
        ],
        watch: true
    })

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const spendMax = () => {
        if (!isLoading && data) {
            setAmountToLock(ethers.utils.formatUnits(data[0], data[1]))
        }
    }

    var needsApproval = true
    var unlockTime = 0
    var amountWei = 0
    if (!isLoading && data) {
        amountWei = ethers.utils.parseUnits(amountToLock == "" ? "0" : amountToLock, data[1])
        needsApproval = amountWei.gt(data[2])
        unlockTime = Date.parse(selectedDate) / 1000
    }

    var functionName = "approve"
    var args = [ZKeyContract.address, amountWei]
    var contract = {
        address: contractAddress,
        abi: erc20ABI
    }
    if (!needsApproval) {
        functionName = "lock"
        args = [contractAddress, amountWei, unlockTime]
        contract = ZKeyContract
    }

    const {
        config
    } = usePrepareContractWrite({
        ...contract,
        functionName: functionName,
        args: args,
        overrides: {
            from: props.address,
        },
    })
    const contractWrite = useContractWrite(config)

    return ( <
        div className = "form" >
        <
        div className = "row" >
        <
        label > Contract: < /label> <input type="text" value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} / >
        <
        /div> <
        div className = "row" >
        <
        label > Tokens: < /label> <input type="number" disabled={!data} placeholder="0.0" value={amountToLock} onChange={(e) => setAmountToLock(e.target.value)}  / >
        <
        div className = "max"
        onClick = {
            spendMax
        } > MAX < /div> <
        /div> <
        div className = "row" >
        <
        label > Unlock Date: < /label> <
        PikadayWrapper value = {
            selectedDate
        }
        onChange = {
            handleDateChange
        }
        disabled = {!data
        }
        /> <
        /div> {
            needsApproval ? < img className = "lock"
            src = {
                approve
            }
            onClick = {
                () => {
                    contractWrite.write()
                }
            }
            />: < img className = "lock"
            src = {
                lock
            }
            onClick = {
                () => {
                    contractWrite.write()
                }
            }
            />
        }

        <
        /div>
    )
}