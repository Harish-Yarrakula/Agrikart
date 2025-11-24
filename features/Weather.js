import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiWind, FiSun, FiDroplet, FiEye, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { BsCloudRain, BsMoonStars, BsSpeedometer2, BsThermometerSun } from 'react-icons/bs';




const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const HighlightCard = ({ title, icon, value, unit, description }) => (
  <div className="bg-slate-800/80 p-4 rounded-lg flex flex-col justify-start">
    <div className="flex justify-between items-center text-slate-400 text-sm">
      <p>{title}</p>
      {icon}
    </div>
    <div className="mt-2">
      <h2 className="text-3xl font-bold text-white">
        {value} <span className="text-xl font-normal">{unit}</span>
      </h2>
      {description && <p className="text-slate-300 mt-1 text-xs">{description}</p>}
    </div>
  </div>
);

const HourCard = ({ time, icon, temp }) => (
  <div className="flex flex-col items-center space-y-1 bg-slate-800/80 p-3 rounded-lg flex-shrink-0 w-24">
    <p className="text-slate-300 text-sm">{time}</p>
  <Image src={`https:${icon}`} alt="weather icon" className="w-10 h-10" width={40} height={40} />
    <p className="text-white font-bold text-lg">{temp}°</p>
  </div>
);



const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = () => {
      setLoading(true);
      setError(null);
      fetch(`https://api.weatherapi.com/v1/forecast.json?key=0259620efd7340c4b3d133829251209&q=16.203197,%2080.391997&days=1&aqi=yes&alerts=yes`)
      .then(res=> res.json())
      .then(data=> setWeatherData(data))
      .catch(err=> setError("Failed to fetch weather data."))
      setLoading(false);
    };

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Loading Weather Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  }

  if (!weatherData) {
    return null;
  }

  const { location, current, forecast } = weatherData;
  const todayForecast = forecast?.forecastday?.[0];

  return (
    <div className="bg-slate-500 text-white min-h-full p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
        
        <div className="lg:col-span-1 xl:col-span-1 bg-slate-800/50 p-6 rounded-xl flex flex-col text-center">
          <h2 className="text-3xl font-bold">{location.name}</h2>
          <p className="text-slate-400 mb-4">{formatDate(location.localtime)}</p>
          <div className="flex items-center justify-center my-6">
            <Image src={`https:${current.condition.icon}`} alt={current.condition.text} className="w-28 h-28" width={112} height={112} />
            <h1 className="text-8xl font-extrabold ml-4">{Math.round(current.temp_c)}°</h1>
          </div>
          <p className="text-2xl capitalize mb-2">{current.condition.text}</p>
          <p className="text-slate-300">Feels like {Math.round(current.feelslike_c)}°</p>
          <div className="flex justify-center items-center space-x-4 mt-2 text-slate-300">
            <span className="flex items-center"><FiArrowUp className="mr-1" /> {Math.round(todayForecast.day.maxtemp_c)}°</span>
            <span className="flex items-center"><FiArrowDown className="mr-1" /> {Math.round(todayForecast.day.mintemp_c)}°</span>
          </div>
        </div>
        
        <div className="lg:col-span-2 xl:col-span-3">
          <div className="mb-8">
            <h3 className="text-slate-400 uppercase tracking-wider mb-4">Hourly Forecast</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar">
              {todayForecast.hour.map((hour) => (
                <HourCard
                  key={hour.time_epoch}
                  time={new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}
                  icon={hour.condition.icon}
                  temp={Math.round(hour.temp_c)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-slate-400 uppercase tracking-wider mb-4">Today's Highlights</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <HighlightCard title="Wind" icon={<FiWind size={20} />} value={current.wind_kph} unit="km/h" description={`Direction: ${current.wind_dir}`} />
              <HighlightCard title="Humidity" icon={<FiDroplet size={20} />} value={current.humidity} unit="%" description={current.humidity > 70 ? "High" : "Normal"} />
              <HighlightCard title="Rain Chance" icon={<BsCloudRain size={20} />} value={todayForecast.day.daily_chance_of_rain} unit="%" description={`Total: ${todayForecast.day.totalprecip_mm}mm`} />
              <HighlightCard title="Pressure" icon={<BsSpeedometer2 size={20} />} value={Math.round(current.pressure_mb)} unit="hPa" />
              <HighlightCard title="Sunrise & Sunset" icon={<FiSun size={20} />} value={todayForecast.astro.sunrise} description={`Sunset: ${todayForecast.astro.sunset}`} />
              <HighlightCard title="Visibility" icon={<FiEye size={20} />} value={current.vis_km} unit="km" />
              <HighlightCard title="UV Index" icon={<BsThermometerSun size={20} />} value={todayForecast.day.uv} description={todayForecast.day.uv <= 2 ? 'Low' : 'Moderate'} />
              <HighlightCard title="Moon Phase" icon={<BsMoonStars size={20} />} value={todayForecast.astro.moon_illumination} unit="%" description={todayForecast.astro.moon_phase} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default WeatherDashboard;
