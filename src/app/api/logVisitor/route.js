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
      console.error("Failed to fetch visitor IP:", error);
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
            console.error("Geolocation error:", error);
            resolve(null);
          }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
        resolve(null);
      }
    });
  };

  try {
    const visitorData = await getVisitorIP();
    const location = await getLocation();

    const response = await fetch("/api/logVisitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ip: visitorData.ip,
        city: visitorData.city,
        country: visitorData.country,
        region: visitorData.region,
        postal: visitorData.postal,
        loc: visitorData.loc,
        org: visitorData.org,
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        referrer: document.referrer || "direct",
        timestamp: new Date().toISOString(),
        deviceType: isMobile() ? "mobile" : "desktop",
        os: navigator.platform,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        lat: location?.latitude,
        lon: location?.longitude,
        acc: location?.accuracy,
      }),
    });

    if (!response.ok) {
      console.error("Failed to log visitor:", response, await response.text());
    } else {
      console.log("Visitor logged successfully");
    }
  } catch (error) {
    console.error("Error logging visitor:", error);
  }
};
