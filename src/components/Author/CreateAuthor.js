import React, { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, TextField, Button,
    Grid, Box, Avatar, IconButton, CircularProgress
} from '@mui/material';
import {
    PhotoCamera,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function CreateAuthor() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [preview, setPreview] = useState(null); // Để xem trước ảnh chân dung
    const [file, setFile] = useState();

    const [authorData, setAuthorData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    // Xử lý thay đổi các trường text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAuthorData({ ...authorData, [name]: value });
    };

    // Xử lý chọn file ảnh và tạo Preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            // setAuthorData({ ...authorData, portrait: file });
            setPreview(URL.createObjectURL(file)); // Tạo đường dẫn tạm để hiển thị ảnh
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', authorData.name);
        formData.append('email', authorData.email);
        formData.append('phone', authorData.phone);
        formData.append('address', authorData.address);
        formData.append('file', file);

        const customerOrders = (selectedOptions || []).map(option => ({
            order_id: option.value,
        }));
        customerOrders.forEach((order, index) => {
            Object.entries(order).forEach(([field, value]) => {
                formData.append(`customer_orders[${index}][${field}]`, value);
            });
        });

        console.log("FormData:", formData);
        console.log("Selected Options:", selectedOptions);
        console.log("customerOrders:", customerOrders);

        try {
            // Thay URL bằng API thực tế của bạn
            await axios.post('http://localhost:8008/api/customers', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Tạo tác giả thành công!");
            navigate('/author');
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [options, setOptions] = useState([]);
    
    const handleChangeSelect = (selectedOption) => {
        setSelectedOptions(selectedOption);
    }
    
    const fetchOptions = async () => {
        setOptionsLoading(true);
        try {
            const orders = await axios.get('http://localhost:8008/api/orders');
            console.log("Orders:", orders.data);
            const formattedOptions = orders.data.map(order => ({
                value: order.id,
                label: order.name
            }));
            setOptions(formattedOptions);
        } catch (error) {
            console.error("Lỗi khi fetch orders:", error);
        } finally {
            setOptionsLoading(false);
        }
    };

    useEffect(() => {
        fetchOptions();
    }, []);


    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Paper elevation={4} sx={{ p: { xs: 2, md: 5 }, borderRadius: 3 }}>

                {/* Tiêu đề */}
                <Box display="flex" alignItems="center" mb={4}>
                    <IconButton onClick={() => navigate('/author')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                        Thêm Tác Giả Mới
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 4 }} display="flex" flexDirection="column" alignItems="center" mb={2}>
                            <Box position="relative">
                                <Avatar
                                    src={preview}
                                    sx={{ width: 120, height: 120, mb: 2, border: '2px solid #1976d2' }}
                                />
                                {preview && (
                                    <IconButton
                                        size="small"
                                        sx={{ position: 'absolute', top: 0, right: -10, bg: 'white', shadow: 1 }}
                                        onClick={() => { setPreview(null); setAuthorData({ ...authorData, portrait: null }) }}
                                    >
                                        <ClearIcon color="error" fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>
                            <Button
                                component="label"
                                startIcon={<PhotoCamera />}
                                size="small"
                            >
                                Chọn Ảnh Chân Dung
                                <input type="file" name="image" hidden accept="image/*" onChange={handleFileChange}/>
                            </Button>
                        </Grid>

                        <Grid item size={{ xs: 8 }}>
                            <Grid container spacing={2}>
                                <Grid item size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Tên đầy đủ"
                                        name="name"
                                        required
                                        onChange={handleChange}
                                        sx={{
                                            "& .MuiFormLabel-asterisk": {
                                                color: "red",
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        type="email"
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth
                                        label="SĐT"
                                        name="phone"
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <Grid item size={{ xs: 12 }}>
                                    <TextField
                                        fullWidth
                                        label="Địa Chỉ"
                                        name="address"
                                        multiline
                                        rows={5}
                                        placeholder="Nhập tóm tắt về sự nghiệp, cuộc đời..."
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item size={{ xs: 12 }}>
                                    <Select
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        isMulti
                                        options={options}
                                        value={selectedOptions}
                                        onChange={handleChangeSelect}
                                        isLoading={optionsLoading}
                                        placeholder="Chọn đơn hàng..."
                                    />
                                </Grid>
                            </Grid>
                        </Grid>


                        {/* Nút hành động */}
                        <Grid item size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                color="primary"
                                onClick={() => navigate('/author')}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                disabled={loading}
                                sx={{ px: 4 }}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu Tác Giả'}
                            </Button>
                        </Grid>

                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default CreateAuthor;