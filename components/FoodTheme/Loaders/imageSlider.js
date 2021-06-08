const ImageLoader = () => {
    let table = []
    // Outer loop to create parent
    for (let i = 0; i < 3; i++) {
        table.push(
            <div>
                <div className="shine" style={{ height: '160px', width: '160px' }}></div>
            </div>
        )
    }
    return table

}


export default ImageLoader;

