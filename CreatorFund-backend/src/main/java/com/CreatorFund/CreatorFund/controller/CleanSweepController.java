package com.CreatorFund.CreatorFund.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CleanSweepController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/clean-sweep")
    public String cleanSweep() {
        try {
            // Drop everything in reverse order of dependencies
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `RoyaltyPayment`");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `RoyaltyCalculation`");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `RightsTransfer`");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `ContentRights`");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `UsageTransaction`");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `DigitalContent`");
            jdbcTemplate.execute("DROP TABLE IF EXISTS `User`");
            jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");
            return "All tables dropped successfully. Please restart the app. DataInitializer will seed fresh data.";
        } catch (Exception e) {
            return "Error during clean sweep: " + e.getMessage();
        }
    }
}
