const cron = require('node-cron');
const { Machine } = require('../models/index');

const initMachineCronJob  = () => {
    // Schedule a cron job to run every day at 2h00 AM by Vietnam timezone
    cron.schedule('0 2 * * *', async() => {
        console.log("⏱ Cron: Đang kiểm tra máy móc... ", new Date().toISOString());

        try {
            const now = new Date().toISOString();

            // Update tất cả các máy có trạng thái 'paused' thành 'operating' nếu có start_again_date bằng ngày hiện tại
            const [affectedRows] = await Machine.update(
                { status: 'operating' },
                {
                    where: {
                        status: 'paused',
                        start_again_date: {
                            [Op.lte]: now
                        }
                    }
                }
            );

            if(affectedRows > 0) {
                console.log(`Cron: Đã cập nhật trạng thái của ${affectedRows} máy sang trạng thái OPERATING`);
            }else{
                console.log("Cron: Không có máy nào cần cập nhật trạng thái.");
            }
        } catch (error) {
            console.error("❌ Cron Error:", error);
        }
    })
}

module.exports = { initMachineCronJob}