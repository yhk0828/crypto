import ApexCharts from "react-apexcharts";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { isDarkAtom } from "./atoms";
import {useRecoilValue} from "recoil";

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface ChartProps {
    coinId : string;
}

function Chart({coinId} : ChartProps){
    const isDark = useRecoilValue(isDarkAtom);
    const {isLoading, data} = useQuery<IHistorical[]>(["ohlcv",coinId], () => fetchCoinHistory(coinId),{
        refetchInterval : 10000
    });
    return (
    <div>
        {isLoading ? "Loading chart..." : (
        <ApexCharts 
    type="line"
    series = {[
        {
            name : "Price",
            data : data?.map(price => price.close) as number[]
        },
    ]} 
    options={{
        theme:{
        mode: isDark? "dark" : "light",
    },
    chart : {
        height: 300,
        width: 500,
        background: "transparent",
        toolbar:{
            show: false,
        }, 
    },
    grid : {show : false},
    stroke: {
        curve: 'smooth',
        width: 5,
    },
    yaxis: {
        show : false,
    },
    xaxis: {
        labels : {show : false},
        axisTicks: {
            show: false
        },
        axisBorder: {
            show: false
        },
    },
    fill : {
        type : 'gradient',
        gradient: {
            gradientToColors: ["blue"],
        },
    },
        colors : ["whitesmoke"],
        tooltip : {
            y: {
                formatter : (value) => `$ ${value.toFixed(3)}`,
            },
        },
    
    }}/>)}</div>
    )
}
export default Chart;