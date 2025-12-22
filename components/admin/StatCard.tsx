import React from "react";

type StatCardProps = {
  title: string;
  value: number;
};

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
};

export default StatCard;
