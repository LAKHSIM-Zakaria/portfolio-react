import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ieajyaxmmqsbjotgdwur.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllYWp5YXhtbXFzYmpvdGdkd3VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MzQ0NTIsImV4cCI6MjA0NzUxMDQ1Mn0.PuGSEN7QRA0ctxsngMmexUcnUl8oyHsZvnQAw55IwrM'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export const logVisitor = async () => {
  const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /Mobi|Android|iPhone|iPad/i.test(userAgent);
  };

  const getVisitorIP = async () => {
    try {
      const response = await fetch("https://ipinfo.io/json");
      const data = await response.json();
      return data;
    } catch (error) {
      //console.error("Failed to fetch visitor IP:", error);
      return { ip: "unknown" };
    }
  };

  const getLocation = async () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            });
          },
          (error) => {
            //console.error("Geolocation error:", error);
            resolve(null);
          }
        );
      } else {
        //console.warn("Geolocation is not supported by this browser.");
        resolve(null);
      }
    });
  };

  try {
    const visitorData = await getVisitorIP();
    const location = await getLocation();

    const payload = {
      ip: visitorData.ip,
      city: visitorData.city,
      region: visitorData.region,
      country: visitorData.country,
      postal_code: visitorData.postal,
      loc: visitorData.loc, // This is a string with "latitude,longitude"
      org: visitorData.org,
      page: window.location.pathname,
      referrer: document.referrer || "direct",
      user_agent: navigator.userAgent,
      devicetype: isMobile() ? "mobile" : "desktop",
      os: navigator.platform,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
      latitude: location?.latitude,
      longitude: location?.longitude,
      accuracy: location?.accuracy,
      timestamp: new Date().toISOString(),
    };

    //console.log("Visitor Payload:", payload);

    const { error } = await supabase.from("visitors").insert(payload);

    if (error) {
      //console.error("Failed to log visitor:", error);
    } else {
      //console.log("Visitor logged successfully");
    }
  } catch (error) {
    //console.error("Error logging visitor:", error);
  }
};