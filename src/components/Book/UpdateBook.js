import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Grid, Box,
    MenuItem, FormControl, InputLabel, Select, Chip, OutlinedInput, CircularProgress
} from '@mui/material';
import { Update, ArrowBack, CloudUpload } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const GENRES = ["Tiểu thuyết", "Trinh thám", "Kinh dị", "Khoa học", "Lịch sử", "Kỹ năng"];

function UpdateBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [bookData, setBookData] = useState({
        title: '', author_id: '', published_year: '', genres: [], synopsis: '', cover_image: null
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [authRes, bookRes] = await Promise.all([
                    axios.get('http://your-api-url.com/api/authors'),
                    axios.get(`http://your-api-url.com/api/books/${id}`)
                ]);
                setAuthors(authRes.data);
                setBookData({ ...bookRes.data, cover_image: null });
                setFetching(false);
            } catch (err) {
                console.error(err);
                navigate('/book');
            }
        };
        loadData();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Quan trọng cho Laravel

        Object.keys(bookData).forEach(key => {
            if (key === 'genres') {
                bookData.genres.forEach(g => formData.append('genres[]', g));
            } else if (bookData[key] !== null) {
                formData.append(key, bookData[key]);
            }
        });

        try {
            await axios.post(`http://your-api-url.com/api/books/${id}`, formData);
            alert("Cập nhật thành công!");
            navigate('/book');
        } catch (err) {
            alert("Lỗi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="secondary" sx={{ mb: 3 }}>
                    Cập Nhật Sách
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Tiêu đề sách" name="title" value={bookData.title} onChange={(e) => setBookData({ ...bookData, title: e.target.value })} required />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Tác giả</InputLabel>
                                <Select name="author_id" value={bookData.author_id} label="Tác giả" onChange={(e) => setBookData({ ...bookData, author_id: e.target.value })}>
                                    {authors.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Năm xuất bản" name="published_year" type="number" value={bookData.published_year} onChange={(e) => setBookData({ ...bookData, published_year: e.target.value })} />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Thể loại</InputLabel>
                                <Select
                                    multiple
                                    value={bookData.genres}
                                    onChange={(e) => setBookData({ ...bookData, genres: e.target.value })}
                                    input={<OutlinedInput label="Thể loại" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => <Chip key={value} label={value} color="secondary" variant="outlined" size="small" />)}
                                        </Box>
                                    )}
                                >
                                    {GENRES.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="outlined" component="label" fullWidth startIcon={<CloudUpload />} color="secondary">
                                Đổi ảnh bìa
                                <input type="file" hidden accept="image/*" onChange={(e) => setBookData({ ...bookData, cover_image: e.target.files[0] })} />
                            </Button>
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={() => navigate('/book')}>Hủy</Button>
                            <Button type="submit" variant="contained" color="secondary" disabled={loading} startIcon={<Update />}>
                                Lưu Thay Đổi
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default UpdateBook;