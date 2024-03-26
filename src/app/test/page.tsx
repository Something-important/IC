import { getDenom } from "../Actions/denoms";
export default function name() {
    const symbol = getDenom("ibc/FE98AAD68F02F03565E9FA39A5E627946699B2B07115889ED812D8BA639576A9", "kujira")?.svg
    return
    <div className="bg-white">
    <img src={getDenom("ukuji","kujira")?.svg} style={{ width: '15%', height: '15%', marginLeft: '10px' }}/>
    </div>
    
}