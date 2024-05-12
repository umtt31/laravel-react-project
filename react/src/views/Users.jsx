import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState();
    const [loading, setLoading] = useState(false);
    const { setNotification } = useStateContext();

    useEffect(() => {
        setLoading(true);
        getUsers(`?page=${currentPage}`);
        setLoading(false);
    }, [currentPage]);

    const getUsers = (page = "") => {
        axiosClient.get("/users" + page).then(({ data }) => {
            setLastPage(data.meta.links.length - 1);
            setUsers(data.data);
        });
    };

    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const onDelete = (u) => {
        if (!window.confirm("Are you sure?")) {
            return;
        }

        axiosClient.delete(`/users/${u.id}`).then(() => {
            //TODO show notification
            setNotification("User successfully updated!");
            getUsers(`?page=${currentPage}`);
        });
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>Users</h1>
                <Link className="btn-add" to={"/users/new"}>
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>CREATE DATE</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>
                                <td colSpan={5} className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link
                                            className="btn-edit"
                                            to={"/users/" + u.id}
                                        >
                                            EDIT
                                        </Link>

                                        <button
                                            onClick={(e) => onDelete(u)}
                                            className="btn-delete"
                                        >
                                            DELETE
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
            </div>
            <div>
                <button onClick={prevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    disabled={currentPage === lastPage - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
