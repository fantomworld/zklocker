import logo from "./img/logo.png"

function Header() {
    return ( <
        div className = "header" >
        <
        a href = "/" > < img src = {
            logo
        }
        /></a >
        <
        div className = "title" > zkSync Liquidity Locker < /div> <
        /div>
    )
}

export default Header