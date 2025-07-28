import { useEffect, useState } from "react";
import { getAllShops } from "../../../services/ShopService";
import PieChart from "../charts/PieChart";

const ShopStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const res = await getAllShops();
        const shops = res?.shops || [];

        const statusCounts: any = {
          approved: 0,
          pending: 0
        };

        shops.forEach((shop: any) => {
          const status = shop.status;
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });

        const formattedData: any = [
          { name: "Approved", value: statusCounts.approved },
          { name: "Pending", value: statusCounts.pending }
        ];

        setData(formattedData);
      } catch (error) {
        console.error("Failed to fetch shop statuses:", error);
      }
    };

    fetchStatusCounts();
  }, []);

  return (
    <div>
      <PieChart title="Shop Status" data={data} />
    </div>
  );
};

export default ShopStatusChart;
