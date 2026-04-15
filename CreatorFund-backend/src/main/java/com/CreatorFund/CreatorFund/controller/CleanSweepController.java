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
            jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY FALSE");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"royalty_payment\"");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"royalty_calculation\"");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"rights_transfer\"");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"content_rights\"");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"usage_transaction\"");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"digital_content\"");
            jdbcTemplate.execute("DROP TABLE IF EXISTS \"user\"");
            jdbcTemplate.execute("SET REFERENTIAL_INTEGRITY TRUE");
            return "All tables dropped successfully. Please restart the app. DataInitializer will seed fresh data.";
        } catch (Exception e) {
            return "Error during clean sweep: " + e.getMessage();
        }
    }
}
