import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import { BASE_COLOR } from '../../../lib/envariables';

const CircularProgressLoader = () => (
    <div className="loaderParent">
        <div className="loader-container">
            <CircularProgress color={BASE_COLOR} size={60} thickness={5} />
        </div>
    </div>
);

export default CircularProgressLoader;