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
        email: '',
        phone: '',
    });

    // 1. Lấy dữ liệu tác giả hiện tại
    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await axios.get(`http://localhost:8008/api/customers/${id}`);
                console.log("API Response:", response.data); // Kiểm tra dữ liệu trả về
                const data = response.data;
                setAuthorData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
                setFetching(false);
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
                alert("Không tìm thấy khách hàng!");
                navigate('/author');
            }
        };
        fetchAuthor();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log('name', name);
        console.log('value', value);

        setAuthorData({ ...authorData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // const formData = new FormData();
        // formData.append('name', authorData.name);
        // formData.append('email', authorData.email);
        // formData.append('phone', authorData.phone);

        // console.log("formData:", formData); // Kiểm tra dữ liệu gửi đi
        // // Giả định dùng Laravel: Cần _method PUT để xử lý FormData
        // formData.append('_method', 'PUT');

        try {
            await axios.put(`http://localhost:8008/api/customers/${id}`, {
                name: authorData.name,
                email: authorData.email,
                phone: authorData.phone,
            });
            alert("Cập nhật thành công!");
            navigate('/author');
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
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
                            Chỉnh Sửa Khách Hàng
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">ID: {id}</Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={4}>
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
                                        label="Email"
                                        name="email"
                                        value={authorData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Số điện thoại"
                                        name="phone"
                                        value={authorData.phone}
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