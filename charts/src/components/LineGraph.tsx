import { Line } from "react-chartjs-2";
import FakeData from '../FakeData'
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import linearChartDtaa from "../FakeData";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

)

const LineGraph = () => {
  const options = {}
  return  <Line options={options} data={linearChartDtaa}/>
};

export default LineGraph;
