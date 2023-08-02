import app from "./app";
import config from "./config/config";
import logger from "./config/logger";
const PORT = config?.PORT


app.listen(PORT, ()=>{
    logger.info("Sever is running at PORT: "+PORT)
})