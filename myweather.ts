import colors from "colors";
import commander from "commander";
import axios,{AxiosResponse} from "axios";
import { encode } from "punycode";

const log = console.log;

const command = commander
    .version('0.1.0')
    .option('-c, --city [name]', 'Add city name')
    .option('-e, --extensions [selection]', 'base:返回实况天气  all:返回预报天气')
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

const URL = "https://restapi.amap.com/v3/weather/weatherInfo";
const KEY = "18b7700ea5f9bfbf6eb484428944c404";

async function BaseWeather(city:string){
    try{
        const response = await axios.get(`${URL}?city=${encodeURI(command.city)}&key=${KEY}`);
        const live =response.data.lives[0];
        log(colors.blue(live.reporttime));
        log(colors.green(`${live.province} ${live.city}`));
        log(colors.yellow(`${live.weather} ${live.temperature}度`));
        log(colors.yellow(`风向 ${live.winddirection}  风力${live.windpower}`));
        log(colors.yellow(`空气湿度 ${live.humidity}`));
    } catch{
        log(colors.red("天气服务出现异常!!!"));
    }
}

interface ForeWeatherResponse{
    status: string;
    count: string;
    info: string;
    infocode: string;
    forecasts:Forecast[];
}

interface Forecast{
    city: string;
    adcode:string;
    province: string;
    reporttime : string;
    casts : Cast[];
}

interface Cast{
    date :string;
    week :string;
    dayweather:string;
    nightweather:string;
    daytemp:string;
    nighttemp:string;
    daywind:string;
    nightwind:string;
    daypower:string;
    nightpower:string;
}

async function AllWeather(city:string){
    try{
        const response = await axios.get(`${URL}?city=${encodeURI(command.city)}&key=${KEY}&extensions=${command.extensions}`);
        const forecast =response.data.forecasts[0];
        log(colors.blue(`当前时间 ${forecast.reporttime}`));
        log(colors.green(`${forecast.province} ${forecast.city}`));
        for(var i=0;i<4;i++){
            const cast =forecast.casts[i];
            log(colors.magenta(`${cast.date} 星期${cast.week}`));
            log(colors.cyan("白天"));
            log(colors.cyan(`${cast.dayweather} ${cast.daytemp}度`));
            log(colors.cyan(`风向:${cast.daywind} 风力:${cast.daypower}`));
            log(colors.yellow("夜晚"));
            log(colors.yellow(`${cast.nightweather} ${cast.nighttemp}度`));
            log(colors.yellow(`风向:${cast.daypower} 风力:${cast.nightpower}`));
        }
    } catch{
        log(colors.red("天气服务出现异常!!!"));
    }
}

if(!command.extensions||command.extensions=="base"){
    BaseWeather(command.city);
}
if(command.extensions=="all"){
    AllWeather(command.city);
}
