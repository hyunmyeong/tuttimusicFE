import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import ReactGA from 'react-ga';

function RouteChangeTracker() {
  const location = useLocation();
  const [initialized, setInitialized] =useState(false);

  useEffect(() => {
    if (!window.location.href.includes("tuttimusic")) {
      ReactGA.initialize(process.env.GOOGLE_ANALYTICS_TRACKING_ID);
    }
    setInitialized(true);
  },[]);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  },[initialized, location]);

}

export default RouteChangeTracker;
