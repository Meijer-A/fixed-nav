/* =============================================
 *
 *   FIXED RESPONSIVE NAV
 *
 *   (c) 2014 @adtileHQ
 *   http://www.adtile.me
 *   http://twitter.com/adtilehq
 *
 *   Free to use under the MIT License.
 *
 * ============================================= */

(function () {

  "use strict";

  // Feature test to rule out some older browsers
  if ("querySelector" in document && "addEventListener" in window && Array.prototype.forEach) {

    // Attach FastClick to remove the 300ms tap delay
    FastClick.attach(document.body);

    // Init smooth scrolling
    smoothScroll.init();

    // Init Responsive Nav
    var navigation = responsiveNav(".nav-collapse", {

      // Close the navigation when it's tapped
      closeOnNavClick: true,
      transition: 300
    });

    // Create a Mask
    var mask = document.createElement("div");
    mask.className = "mask";

    // Append the mask inside <body>
    document.body.appendChild(mask);

    // Disable mask transitions on Android to boost performance
    if (navigator.userAgent.match(/Android/i) !== null) {
      document.documentElement.className += " android";
    }

    // Find navigation links and save a reference to them
    var nav = document.querySelector(".nav-collapse ul"),
      links = nav.querySelectorAll("a");

    // "content" will store all the location cordinates
    var content;

    // Set up an array of locations which we store in "content"
    var setupLocations = function () {
      content = [];
      [].forEach.call(links, function (el, i) {
        var href = links[i].getAttribute("href").replace("#", "");
        content.push(document.getElementById(href).offsetTop + 200);
      });
    };

    // call locations set up once
    setupLocations();

    // Re-calculate locations on window resize and orientation change
    window.addEventListener("resize", function () {
      setupLocations();
    }, false);

    // Highlight active link on the navigation
    var selectActiveMenuItem = function (i) {
      [].forEach.call(links, function (el, i) {
        links[i].parentNode.className = "";
      });
      links[i].parentNode.className = "active";
    };

    // Highlight active link when scrolling
    var wasNavigationTapped = false;
    window.addEventListener("scroll", function () {

      // Determine viewport and body size
      var top = window.pageYOffset,
        bodyheight = document.body.offsetHeight,
        viewport = window.innerHeight;

      // For each content link, when it's in viewport, highlight it
      if (!wasNavigationTapped) {
        [].forEach.call(content, function (loc, i) {
          if ((loc > top && (loc < top + 300 || (top + viewport) >= bodyheight))) {
            selectActiveMenuItem(i);
          }
        });
      }
    }, false);

    // Close navigation when tapping the mask under it
    mask.addEventListener("click", function () {
      navigation.close();
    }, false);

    // Clear wasNavigationTapped check after scrolling
    var clearTapCheck = function () {
      setTimeout(function () {
        wasNavigationTapped = false;
      }, 500);
    };

    // Select the right navigation item when tapping the logo
    document.querySelector(".logo").addEventListener("click", function () {
      wasNavigationTapped = true;

      // Select first navigation item
      selectActiveMenuItem(0);

      // Close navigation
      navigation.close();

      // Remove hash from the URL if pushState is supported
      if (history.pushState) {
        history.pushState("", document.title, window.location.pathname);
      }

      // Clear wasNavigationTapped check
      clearTapCheck();
    }, false);

    // When a navigation item is tapped, select it and begin scrolling
    [].forEach.call(links, function (el, i) {
      links[i].addEventListener("click", function (e) {

        // Prevent default functionality
        e.preventDefault();

        // Navigation was tapped, set flag to true
        wasNavigationTapped = true;

        // Select right navigation item (we are passing which one to select "i")
        selectActiveMenuItem(i);

        // Show the URL of the section on the address bar
        var thisID = this.getAttribute("href").replace("#", ""),
          pane = document.getElementById(thisID);

        // If the URL isn't "#home", change it
        if (thisID !== "home") {
          pane.removeAttribute("id");
          location.hash = "#" + thisID;
          pane.setAttribute("id", thisID);

        // If the URL is "#home", remove hash from the URL
        } else {
          if (history.pushState) {
            history.pushState("", document.title, window.location.pathname);
          }
        }

        // Clear wasNavigationTapped check
        clearTapCheck();
      }, false);
    });

  }

})();
