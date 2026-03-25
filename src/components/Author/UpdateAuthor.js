import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button,
    Grid, Box, Avatar, IconButton, CircularProgress, Divider
} from '@mui/material';
import {
    PhotoCamera,
    Update as UpdateIcon,
    ArrowBack as ArrowBackIcon,
    DeleteForever as DeleteIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateAuthor() {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true); // Trạng thái đang tải dữ liệu cũ
    const [preview, setPreview] = useState(null); // Preview ảnh mới chọn

    const [authorData, setAuthorData] = useState({
        name: '',
        birth_year: '',
        nationality: '',
        biography: '',
        portrait: null,
        current_portrait_url: '' // Để hiển thị ảnh cũ từ server
    });

    // 1. Lấy dữ liệu tác giả hiện tại
    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await axios.get(`http://your-api-url.com/api/authors/${id}`);
                const data = response.data;
                setAuthorData({
                    name: data.name || '',
                    birth_year: data.birth_year || '',
                    nationality: data.nationality || '',
                    biography: data.biography || '',
                    portrait: null,
                    current_portrait_url: data.portrait_url // Đường dẫn ảnh từ Backend
                });
                setFetching(false);
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
                alert("Không tìm thấy tác giả!");
                navigate('/author');
            }
        };
        fetchAuthor();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthorData({ ...authorData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAuthorData({ ...authorData, portrait: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', authorData.name);
        formData.append('birth_year', authorData.birth_year);
        formData.append('nationality', authorData.nationality);
        formData.append('biography', authorData.biography);

        // Chỉ gửi ảnh nếu người dùng chọn ảnh mới
        if (authorData.portrait) {
            formData.append('portrait', authorData.portrait);
        }

        // Giả định dùng Laravel: Cần _method PUT để xử lý FormData
        formData.append('_method', 'PUT');

        try {
            await axios.post(`http://your-api-url.com/api/authors/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Cập nhật thành công!");
            navigate('/author');
        } catch (error) {
            alert("Cập nhật thất bại!");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={() => navigate('/author')} sx={{ mr: 1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h5" fontWeight="800" color="secondary">
                            Chỉnh Sửa Tác Giả
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">ID: {id}</Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>

                        {/* Ảnh chân dung */}
                        <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
                            <Typography variant="subtitle2" gutterBottom color="textSecondary">
                                Ảnh Chân Dung
                            </Typography>
                            <Avatar
                                src={preview || authorData.current_portrait_url}
                                sx={{ width: 160, height: 160, mb: 2, boxShadow: 3, border: '4px solid #fff' }}
                            />
                            <Button
                                variant="contained"
                                component="label"
                                startIcon={<PhotoCamera />}
                                size="small"
                                color="secondary"
                            >
                                Đổi Ảnh
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </Button>
                        </Grid>

                        {/* Thông tin Text */}
                        <Grid item xs={12} md={8}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Họ và tên"
                                        name="name"
                                        value={authorData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Năm sinh"
                                        name="birth_year"
                                        type="number"
                                        value={authorData.birth_year}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Quốc tịch"
                                        name="nationality"
                                        value={authorData.nationality}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tiểu sử"
                                        name="biography"
                                        multiline
                                        rows={6}
                                        value={authorData.biography}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Nút hành động */}
                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => {/* Gọi hàm delete đã viết ở trên */ }}
                                >
                                    Xóa Tác Giả
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <UpdateIcon />}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang cập nhật...' : 'Cập Nhật Ngay'}
                                </Button>
                            </Box>
                        </Grid>

                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default UpdateAuthor;