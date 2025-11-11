import { Input, message, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import ShopTable from './components/ShopTable';
import { deleteShop, getShop } from '../../../services/admin/apiShop';
import SelectLocationMap from '../../vendor/Shop/components/SelectLocationMap';
import { usePermissions } from '../../../hooks/usePermissions';

function Shop() {
    const [searchText, setSearchText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const { hasPermission } = usePermissions();

    useEffect(() => { fetchShop() }, [])

    const fetchShop = async () => {
        setLoading(true)
        try {
            const res = await getShop()
            setDataSource(res)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Delete Shop',
            content: `Are you sure you want to delete "${record.name}"?`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk: async () => {
                try {
                    await deleteShop(record._id);
                    message.success("Shop deleted successfully!");
                    fetchShop();
                } catch {
                    message.error("Failed to delete shop.");
                }
            }
        });
    };

    const [selectedLocation, setSelectedLocation] = useState( {lat: 28.6139, lng: 77.2090});

    const handleLocationSelect = (latlng) => {
        setSelectedLocation(latlng);
        console.log('Selected Location:', latlng);
        // You can now use latlng for your application's logic (e.g., save to state, send to API)
    };

    return (
        <>

            {/* <SelectLocationMap onSelect={handleLocationSelect} /> */}
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between '>
                <Input.Search
                    placeholder="Search by shop name or vendor name"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        maxWidth: 300,
                        borderRadius: '6px'
                    }}
                    size="large"
                />
            </div>
            <ShopTable data={dataSource} searchText={searchText} loading={loading} onDelete={handleDelete} fetchShop={fetchShop} hasPermission={hasPermission}/>
        </>
    )
}

export default Shop
