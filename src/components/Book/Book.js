import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const rows = [
    { id: 1, name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
    { id: 3, name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
    { id: 4, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
    { id: 5, name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 },
];

function Book() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    // const fetchBooks = async () => {
    //     const res = await axios.get('http://your-api-url.com/api/books');
    //     setBooks(res.data);
    // };

    // useEffect(() => {
    //     fetchBooks();
    // }, []);


    const handleUpdate = (id) => {
        // Implement update functionality here
        console.log(`Update book with id: ${id}`);
        navigate(`/book/update?id=${id}`)
    }
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này?")) {
            try {
                await axios.delete(`http://your-api-url.com/api/books/${id}`);
                alert("Đã xóa sách thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa sách:", error);
                alert("Xóa thất bại!");
            }
        }
    };
    return (
        <div>
            <h1>Book List</h1>
            <Button href='/book/create' variant="contained">Create Book</Button>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ background: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Tiêu đề sách</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Tác giả</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Năm xuất bản</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Thể loại</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ảnh bìa</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Tóm tắt nội dung</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">{row.calories}</TableCell>
                                <TableCell align="right">{row.fat}</TableCell>
                                <TableCell align="left">{row.carbs}</TableCell>
                                <TableCell align="left">{row.protein}</TableCell>
                                <TableCell align="left">{row.protein}</TableCell>
                                <TableCell align="center">
                                    <Button onClick={() => handleUpdate(row.id)} variant="contained" size="small">
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDelete(row.id)} variant="contained" size="small" style={{ marginLeft: 8 }}>
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
export default Book;