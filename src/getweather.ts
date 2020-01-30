import colors from "colors";
import commander from "commander";
import axios,{AxiosResponse} from "axios";
import { encode } from "punycode";

const command = commander
    .version('0.1.0')
    .option('-c, --city [name]', 'Add city name')
    .parse(process.argv);

if(process.argv.slice(2).length === 0){
    command.outputHelp(colors.red);
    process.exit();
}

interface IWeatherResponse{
    status: string;
    count: string;
    info: string;
    infocode: string;
    lives:ILive[];
}

interface ILive{
    province: string;
    city: string;
    adcode:string;
    weather: string;
    temperature: string;
    winddirection: string;
    windpower: string;
    humidity: string;
    reporttime : string;
}

const log = console.log;
//async function getWeather(city:string){}
const URL = "https://restapi.amap.com/v3/weather/weatherInfo";
const KEY = "18b7700ea5f9bfbf6eb484428944c404";
axios.get(`${URL}?city=${encodeURI(command.city)}&key=${KEY}`).then((res:AxiosResponse<IWeatherResponse>) =>{
    const live = res.data.lives[0];
    log(colors.white(live.reporttime));
    log(colors.green(`${live.province} ${live.city}`));
    log(colors.yellow(`${live.weather} ${live.temperature}度`));
    log(colors.yellow(`风向 ${live.winddirection}  风力${live.windpower}`));
    log(colors.yellow(`空气湿度 ${live.humidity}`));
}).catch(() =>{
    log(colors.red("天气服务出现异常!!!"));
});
