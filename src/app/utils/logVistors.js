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
      return { ip: "unknown", hostname: "unknown" }; // Default if the IP info call fails
    }
  };

  const getHostname = async (ip) => {
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/hostname`);
      const data = await response.text(); // hostname is returned as plain text
      return data;
    } catch (error) {
      return "unknown"; // Default if the hostname lookup fails
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
            resolve(null);
          }
        );
      } else {
        resolve(null);
      }
    });
  };

  try {
    const visitorData = await getVisitorIP();
    const hostname = await getHostname(visitorData.ip); // Fetch the hostname using the IP address
    const location = await getLocation();
    console.log("Current URL:", window.location.href);
    const payload = {
      ip: visitorData.ip,
      hostname: hostname, // Add hostname to the payload
      city: visitorData.city,
      region: visitorData.region,
      country: visitorData.country,
      postal_code: visitorData.postal,
      loc: visitorData.loc, // This is a string with "latitude,longitude"
      org: visitorData.org,
      current_url: window.location.href, // Full URL of the current page
      referrer: document.referrer || "direct", // Referrer URL
      page: window.location.pathname, // Path part of the current URL
      host: window.location.hostname, // Domain of the current URL
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

    const { error } = await supabase.from("visitors").insert(payload);

    if (error) {
      console.error("Failed to log visitor:", error);
    } else {
      console.log("Visitor logged successfully");
    }
  } catch (error) {
    console.error("Error logging visitor:", error);
  }
};
