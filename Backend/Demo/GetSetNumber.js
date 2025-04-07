export default async function GetSetNumber(set){
    if (set=="S01") return "S02"
    if (set=="S02") return "S03"
    if (set=="S03") return "S01"
    else return "S01"
}