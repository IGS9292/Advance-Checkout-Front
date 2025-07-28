// import { Menu, MenuItem } from "@mui/material";
// import dayjs from "dayjs";

// const getRange = (preset: string) => {
//   const today = dayjs();
//   switch (preset) {
//     case "yesterday":
//       return [today.subtract(1, "day"), today.subtract(1, "day")];
//     case "thisWeek":
//       return [today.startOf("week"), today.endOf("week")];
//     case "lastWeek":
//       return [
//         today.subtract(1, "week").startOf("week"),
//         today.subtract(1, "week").endOf("week")
//       ];
//     case "lastMonth":
//       return [
//         today.subtract(1, "month").startOf("month"),
//         today.subtract(1, "month").endOf("month")
//       ];
//     default:
//       return [today.startOf("month"), today.endOf("month")];
//   }
// };

// export default function DateFilter({ anchorEl, onClose, onSelect }) {
//   const handleSelect = (key: string) => {
//     const [start, end] = getRange(key);
//     onSelect(start.toISOString(), end.toISOString());
//     onClose();
//   };

//   return (
//     <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
//       <MenuItem onClick={() => handleSelect("yesterday")}>Yesterday</MenuItem>
//       <MenuItem onClick={() => handleSelect("thisWeek")}>This Week</MenuItem>
//       <MenuItem onClick={() => handleSelect("lastWeek")}>Last Week</MenuItem>
//       <MenuItem onClick={() => handleSelect("lastMonth")}>Last Month</MenuItem>
//     </Menu>
//   );
// }
