import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faThList, faTable } from '@fortawesome/free-solid-svg-icons';
import TagInput from './TagInput';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [viewMode, setViewMode] = useState('card');
    const [tags, setTags] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);  // Pour stocker le nombre total d'items

    const fetchUsers = () => {
        const terms = tags;
        fetch(`http://localhost:3000/user/${page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ terms }),
        })
            .then(response => response.json())
            .then(data => {
                if (page === 1) {
                    setUsers(data.data);
                    setTotalCount(data.count);
                } else {
                    setUsers(prevUsers => [...prevUsers, ...data.data]);
                }
            })
            .catch(error => console.error('Error fetching user list:', error));
    };

    useEffect(() => {
        fetchUsers();
    }, [tags, page]);

    const loadMoreUsers = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleSearch = () => {
      setPage(1); 
      fetchUsers(); 
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center space-x-2 mb-4">
                <div className="flex flex-grow items-center border bg-white">
                    <TagInput tags={tags} setTags={setTags} />
                    <button
                        className="bg-blue-500 text-white flex items-center"
                        onClick={handleSearch}
                    >
                    <FontAwesomeIcon className="bg-blue-500 text-white rounded-r-md flex items-center" icon={faMagnifyingGlass} onClick={handleSearch} />
                    </button>
                </div>
                <div className="flex space-x-0 ml-2">
          <button
            onClick={() => setViewMode('card')}
            className="bg-gray-500 text-white px-4 py-2 rounded-l-md border-r border-gray-600"
          >
            <FontAwesomeIcon icon={faThList} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className="bg-gray-600 text-white px-4 py-2 rounded-r-md"
          >
            <FontAwesomeIcon icon={faTable} />
          </button>
        </div>
            </div>
            {viewMode === 'card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {users.map(user => (
                        <div
                            key={user.id}
                            className="bg-gray-800 text-white rounded-md flex flex-col items-center transition-transform transform hover:scale-105"
                        >
                            <img src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} className="rounded-md mb-2 w-full h-48 object-cover" />
                            <h2 className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
                            <p>{user.jobTitle}</p>
                            <p>{user.email}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <table className="w-full text-white">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-2">Image</th>
                            <th className="p-2">Name</th>
                            <th className="p-2">Job</th>
                            <th className="p-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`hover:scale-105 ${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}`}
                            >
                                <td className="p-2">
                                    <img src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} className="w-16 h-16 object-cover rounded-md" />
                                </td>
                                <td className="p-2">{`${user.firstName} ${user.lastName}`}</td>
                                <td className="p-2">{user.jobTitle}</td>
                                <td className="p-2">{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="text-white text-right mt-4">
                {users.length}/{totalCount}
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={loadMoreUsers} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Load More
                </button>
            </div>
        </div>
    );
};

export default Home;
