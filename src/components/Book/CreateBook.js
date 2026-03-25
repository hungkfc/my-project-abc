import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button, Grid, Box,
    MenuItem, FormControl, InputLabel, Select, Chip, OutlinedInput, CircularProgress
} from '@mui/material';
import { CloudUpload, Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GENRES = ["Tiểu thuyết", "Trinh thám", "Kinh dị", "Khoa học", "Lịch sử", "Kỹ năng"];

function CreateBook() {
    const navigate = useNavigate();
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookData, setBookData] = useState({
        title: '',
        author_id: '',
        published_year: '',
        genres: [],
        synopsis: '',
        cover_image: null
    });

    // Lấy danh sách tác giả từ API
    useEffect(() => {
        axios.get('http://your-api-url.com/api/authors')
            .then(res => setAuthors(res.data))
            .catch(err => console.error("Lỗi tải tác giả", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.keys(bookData).forEach(key => {
            if (key === 'genres') {
                bookData.genres.forEach(g => formData.append('genres[]', g));
            } else if (bookData[key]) {
                formData.append(key, bookData[key]);
            }
        });

        try {
            await axios.post('http://your-api-url.com/api/books', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Thêm sách thành công!");
            navigate('/book');
        } catch (error) {
            alert("Lỗi khi tạo sách");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
                    Thêm Sách Mới
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Tiêu đề sách" name="title" required onChange={handleChange} />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Tác giả</InputLabel>
                                <Select name="author_id" value={bookData.author_id} label="Tác giả" onChange={handleChange}>
                                    {authors.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Năm xuất bản" name="published_year" type="number" onChange={handleChange} />
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
                                            {selected.map((value) => <Chip key={value} label={value} color="primary" variant="outlined" />)}
                                        </Box>
                                    )}
                                >
                                    {GENRES.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant="outlined" component="label" fullWidth startIcon={<CloudUpload />}>
                                {bookData.cover_image ? bookData.cover_image.name : "Tải lên ảnh bìa sách"}
                                <input type="file" hidden accept="image/*" onChange={(e) => setBookData({ ...bookData, cover_image: e.target.files[0] })} />
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Tóm tắt" name="synopsis" multiline rows={4} onChange={handleChange} />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button startIcon={<ArrowBack />} onClick={() => navigate('/book')}>Hủy</Button>
                            <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : <Save />}>
                                Lưu Sách
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default CreateBook;