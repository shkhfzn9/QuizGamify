const LeaderboardTable = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Points
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((user, index) => (
              <tr
                key={user.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{index + 4}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-indigo-600">
                        {user.avatar}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {user.points} pts
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.change === "up" && (
                    <span className="text-green-600 flex items-center">
                      <i className="fas fa-arrow-up mr-1"></i> Up
                    </span>
                  )}
                  {user.change === "down" && (
                    <span className="text-red-600 flex items-center">
                      <i className="fas fa-arrow-down mr-1"></i> Down
                    </span>
                  )}
                  {user.change === "same" && (
                    <span className="text-gray-500 flex items-center">
                      <i className="fas fa-minus mr-1"></i> Same
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
