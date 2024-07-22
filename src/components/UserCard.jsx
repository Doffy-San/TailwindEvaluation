import React from 'react';

function UserCard({ user }) {
  if (!user) return null;

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img
        src={user.imageUrl}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm mb-1">{user.jobTitle}</p>
        <p className="text-sm">{user.email}</p>
      </div>
    </div>
  );
}

export default UserCard;
