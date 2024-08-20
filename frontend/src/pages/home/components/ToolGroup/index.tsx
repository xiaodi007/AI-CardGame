import React from 'react';

const ToolGroup = ({ items, onClick }) => {
  // 使用对象来计算每个道具的数量，并记录每个道具的索引
  const itemCounts = items.reduce((acc, item, index) => {
    if (!acc[item]) {
      acc[item] = { count: 0, indices: [] };
    }
    acc[item].count += 1;
    acc[item].indices.push(index + 1);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(itemCounts).map(([item, { count, indices }]) => (
        <div key={item} className="relative inline-block">
            <img
              width={100}
              height={150}
              style={{ objectFit: "fill" }}
              onClick={() => onClick(item, indices)} // Change this to setToolSelectedModalOpen(true)
              src={`/assets/tool/${item}.png`}
            />
          {count > 1 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
              {count}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default ToolGroup;
