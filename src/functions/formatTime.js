export default function formatTime({ time }) {
  const since = Date.now() - time;
  const limits = [1000, 60000, 3600000, 86400000];
  const measures = ["segundo", "minuto", "hora"];
  const index = limits.findIndex((value) => since < value);

  switch (index) {
    case -1:
      const currentYear = new Date().getFullYear();
      const postDate = new Date(time);
      const day = postDate.getDate();
      const month = postDate.getMonth() + 1;
      const year = postDate.getFullYear();
      if (currentYear === year) return [day, month].join("/");
      else return [day, month, year].join("/");
    case 0:
      return "Agora";
    default:
      const amount = Math.floor(since / limits[index - 1]);
      const name = measures[index - 1];
      return [amount, name + (amount > 1 ? "s" : ""), "atrás"].join(" ");
  }
}
