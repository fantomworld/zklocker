import Footer from "./footer";
import Header from "./header";
import deposit from "./img/deposit.png"
import withdraw from "./img/withdraw.png"

function App() {
    return ( <
        div className = "app" >
        <
        Header / >
        <
        div className = "container" >
        Please select one of the following options <
        div className = "options" >
        <
        a href = "/deposit" > < img src = {
            deposit
        }
        /></a >
        <
        a href = "/withdraw" > < img src = {
            withdraw
        }
        /></a >
        <
        /div> <
        /div> <
        Footer / >
        <
        /div>
    );
}

export default App;