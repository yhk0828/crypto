import {useParams} from "react-router";
import styled from "styled-components";
import {Link} from "react-router-dom";
import {useState, useEffect} from "react";
import {Route, Switch, useLocation,useRouteMatch} from "react-router-dom";
import Price from "./Pirce";
import Chart from "./Chart";
import { useQuery } from "react-query";
import {fetchCoinInfo, fetchCoinTickers } from "../api";
import {Helmet} from "react-helmet";



interface RouterParams{
    coinId: string;
}

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: rgba(0,0,0,0.5);
    padding: 10px 20px;
    broder-radius: 10px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    span : first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

const Description = styled.p`
    margin: 20px 0px;
`
const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`
const Tab = styled.span<{isActive : boolean}>`
    text-align: center;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    background-color: rgba(0,0,0,0.5);
    padding: 7px 0px;
    border-radius: 10px;
    color : ${props => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
    a {
        display: block;
    }
`

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;
const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
    
    p{
        color: red;
        width: 40px;
        height: 40px;
    }
    
`;
const Title = styled.h1`
    width : 100%;
    font-size: 48px;
    color:${props => props.theme.accentColor};
    text-align: center;
    padding-left: 40px;
`;
const Loader = styled.span`
    text-align: center;
    display: block;
`;

interface RouteState{
    state:{
        name: string;
    }
}

interface ITag{
    coin_counter: number;
    ico_counter: number;
    id: string;
    name: string;
}

interface InfoData {
    id : string ;
    name : string ;
    symbol : string ;
    rank : number ;
    is_new : boolean ;
    is_active : boolean ;
    type : string ;
    logo : string ;
    tags : ITag[] ;
    description : string ;
    message : string ;
    open_source : boolean ;
    started_at : string ;
    development_status : string ;
    hardware_wallet : boolean ;
    proof_type : string ;
    org_structure : string ;
    hash_algorithm : string ;
    links : object ;
    links_extended : object ;
    whitepaper : object ;
    first_data_at : string ;
    last_data_at : string ;
}
interface PriceData{
    id :string;
    name :  string;
    symbol :  string;
    rank :  number;
    circulating_supply :  number;
    total_supply :  number;
    max_supply :  number;
    beta_value :  number;
    first_data_at :  string;
    last_updated :  string;
    quotes : {
        USD : {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;

        }
    };
}

interface ICoinProps{
}

function Coin({}: ICoinProps){
    const {coinId} = useParams<RouterParams>();
    const {state} = useLocation() as RouteState;
    const PriceMatch = useRouteMatch(`/${coinId}/price`);
    const ChartMatch = useRouteMatch(`/${coinId}/chart`);
    const {isLoading : infoLoading, data : infoData} = useQuery<InfoData>(
        ["info", coinId],() => fetchCoinInfo(coinId));
    const {isLoading : tickersLoading, data : tickersData} = useQuery<PriceData>(
        ["tickers", coinId],() => fetchCoinTickers(coinId),
        {
            refetchInterval : 5000,
        });
    /*const [loading , setLoading] = useState(true);
    const location = useLocation();
    const [info , setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();
    useEffect(()=>{
        (async () => {
           const infoData = await (await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)).json();
           
           const priceData = await (await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)).json();
           
           setInfo(infoData);
           setPriceInfo(priceData);
           setLoading(false);
           
        })();
    },[coinId]);*/
    const loading = infoLoading || tickersLoading;


    return <Container>
        <Helmet>
            <title>
                {state?.name ? state.name : loading ? "Loading.." : infoData?.name}
            </title>
        </Helmet>
    <Header>
        <Title>
            {state?.name ? state.name : loading ? "Loading.." : infoData?.name}
        </Title>
        <Link to={"/"}>
            <p>Back</p>
        </Link>
    </Header>
    {loading ? (
        <Loader>
        "Loading..."
        </Loader>
    ) : (
    <>
        <Overview>
            <OverviewItem>
                <span>RANK</span>
                <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
                <span>SYMBOL</span>
                <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
                <span>Price</span>
                <span>{tickersData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
        </Overview>
        <Description>
            <span>{infoData?.description}</span>
        </Description>
        <Overview>
            <OverviewItem>
                <span>TOTAL SUPPLY</span>
                <span>{tickersData?.total_supply}</span>
            </OverviewItem>
            <OverviewItem>
                <span>MAX SUPPLY</span>
                <span>{tickersData?.max_supply}</span>
            </OverviewItem>
        </Overview>
        <Tabs>
            <Tab isActive={PriceMatch !== null}>
                <Link to={`/${coinId}/price`}>
                    Price
                </Link>
            </Tab>
            <Tab isActive={ChartMatch !== null}>
                <Link to={`/${coinId}/chart`}>
                    Chart
                </Link>
            </Tab>
        </Tabs>
        <Switch>
            <Route>
                <Route path={`/${coinId}/price`}>
                    <Price></Price>
                </Route>
                <Route path={`/${coinId}/chart`}>
                    <Chart coinId={coinId}></Chart>
                </Route>
            </Route>
        </Switch>
    </>
    )}
    </Container>;
};
export default Coin;