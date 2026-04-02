import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const rows = [
    { id: 1, name: 'Frozen yoghurt', calories: 259, fat: 6.0, carbs: 24, protein: 4.0 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
    { id: 3, name: 'Eclair', calories: 265, fat: 16.0, carbs: 24, protein: 6.0 },
    { id: 4, name: 'Cupcake', calories: 315, fat: 3.7, carbs: 67, protein: 4.3 },
    { id: 5, name: 'Gingerbread', calories: 366, fat: 16.0, carbs: 49, protein: 3.9 },
];

function Author() {
    const navigate = useNavigate();
    const [authors, setAuthors] = useState([]);

    const fetchAuthors = async () => {
        const res = await axios.get('http://localhost:8008/api/customers');
        setAuthors(res.data);
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const handleUpdate = (id) => {
        // Implement update functionality here
        console.log(`Update author with id: ${id}`);
        navigate(`/author/update?id=${id}`)
    }
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tác giả này không?")) {
            try {
                await axios.delete(`http://localhost:8008/api/customers/${id}`);
                alert("Xóa thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa tác giả này.");
            }
        }
    };
    return (
        <div>
            <h1>Author List</h1>
            <Button href='/author/create' variant="contained">Create Author</Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ background: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Tên tác giả</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Năm sinh</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Quốc tịch</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ảnh</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Tiểu sử</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {authors.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="right">{row.email}</TableCell>
                                <TableCell align="left">{row.phone}</TableCell>
                                <TableCell align="right">
                                    <img
                                        src={row.file_url}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                    />
                                </TableCell>
                                <TableCell align="left">{row.address}</TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => handleUpdate(row.id)} variant="contained" size="small" color='warning'>
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(row.id)} variant="contained" size="small" color='error' style={{ marginLeft: 8 }}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
export default Author;