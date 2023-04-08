import Footer from "./footer";
import Header from "./header";
import enter from "./img/enter.png";

function Home() {
    return ( <
        div className = "app" >
        <
        Header / >
        <
        div className = "container" >
        zKey offers zkSync developers an easy to use liquidity locker dApp that is completely free to utilize <
        a href = "/app" > < img className = "enter"
        src = {
            enter
        }
        /></a >
        <
        /div> <
        Footer / >
        <
        /div>
    );
}

export default Home;