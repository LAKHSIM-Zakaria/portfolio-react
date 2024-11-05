useEffect(() => {
    const logVisitor = async () => {
      const isMobile = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return /Mobi|Android|iPhone|iPad/i.test(userAgent);
      };
  
      const getVisitorIP = async () => {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
        } catch (error) {
          console.error('Failed to fetch visitor IP:', error);
          return 'unknown';
        }
      };
  
      const getLocation = async () => {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy, // Accuracy of the location
                });
              },
              (error) => {
                console.error('Geolocation error:', error);
                resolve(null); // Resolve with null if there was an error
              }
            );
          } else {
            console.warn('Geolocation is not supported by this browser.');
            resolve(null); // Resolve with null if geolocation is not supported
          }
        });
      };
  
      const visitorIP = await getVisitorIP();
      const location = await getLocation();
  
      const response = await fetch('/api/logVisitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Visitor Information
          ip: visitorIP,
          page: window.location.pathname,
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString(),
  
          // Device Information
          deviceType: isMobile() ? 'mobile' : 'desktop',
          os: navigator.platform,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          language: navigator.language,
          connectionType: navigator.connection?.effectiveType || 'unknown',
  
          // User Authentication Data (if applicable)
          userId: 'user-unique-id', // Replace with actual user ID from your auth system
          username: 'user-username', // Replace with actual username
          email: 'user-email@example.com', // Be cautious about sending sensitive data
          roles: ['admin', 'editor'], // Example roles
          accountStatus: 'active', // Replace with actual account status
          lastLogin: new Date().toISOString(), // Replace with actual last login timestamp
  
          // Session and Engagement Metrics
          sessionId: 'session-unique-id', // Replace with actual session ID
          timeSpentOnPage: 0, // You can calculate this dynamically
          clickTracking: [], // Capture click events if necessary
  
          // Image Data
          uploadedImages: [
            {
              url: 'image-url.jpg', // Replace with actual uploaded image URL
              size: 204800, // Replace with actual image size in bytes
              format: 'JPEG', // Replace with actual image format
              uploadTimestamp: new Date().toISOString(), // Replace with actual upload timestamp
            },
          ],
          profilePicture: {
            url: 'profile-pic-url.jpg', // Replace with actual profile picture URL
            size: 102400, // Replace with actual profile picture size in bytes
          },
  
          // Location Data
          location: location || {
            latitude: null,
            longitude: null,
            accuracy: null,
          }, // Use null if location could not be obtained
  
          // Demographic Data (if applicable)
          age: 'user-age', // Replace with actual age if collected
          gender: 'user-gender', // Replace with actual gender if collected
  
          // Performance and System Data
          loadTime: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart, // Example load time calculation
          errorLogs: [], // Capture any errors if necessary
  
          // Marketing and Referral Data
          marketingSource: 'utm_source', // Capture UTM parameters if applicable
  
          // Customization and Personalization Data
          userSettings: {}, // Replace with actual user settings if applicable
  
          // Legal and Compliance Data
          consentGiven: true, // Replace with actual consent status
        }),
      });
  
      if (!response.ok) {
        console.error('Failed to log visitor:', response.status, await response.text());
      }
    };
  
    logVisitor();
  }, []);
  