export default {
    getTime : (duration) => {
      let contour = duration.match(/^(\d+)\:(\d+)\:(\d+)$/);
      let total = (Number.parseInt(contour[1]) * 3600) +
                  (Number.parseInt(contour[2]) * 60) +
                   Number.parseInt(contour[3]);
      return total;
    },
    getDuration : (seconds) => {
      var hours   = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var seconds = seconds - (hours * 3600) - (minutes * 60);
      var time = hours < 10 ?  "0"+ hours +":" : hours + ":";

        minutes = (minutes < 10 && time !== "") ? "0" + minutes : String(minutes);
        time += minutes+":";
        time += (seconds < 10) ? "0"+seconds : String(seconds);

      return time;
    }
};
