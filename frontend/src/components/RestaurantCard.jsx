const RestaurantCard = (props) => {
  const { data } = props;
  return (
    <div className="w-[250px] rounded-md overflow-hidden shadow-lg border border-amber-400 hover:shadow-xl hover:scale-105 transition-transform duration-200">
      <img
        src={data.img}
        alt="Restaurant"
        className="h-[160px] w-full object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{data.name}</h2>
        <h4 className="text-sm text-gray-600">{data.cuisine}</h4>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-700">
          <span>⭐ {data.avgRating}</span>
          <span>⏱ {data.deliveryTime} </span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
