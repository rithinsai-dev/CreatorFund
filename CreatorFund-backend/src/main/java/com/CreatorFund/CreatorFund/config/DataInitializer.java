package com.CreatorFund.CreatorFund.config;

import com.CreatorFund.CreatorFund.model.*;
import com.CreatorFund.CreatorFund.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private DigitalContentRepository digitalContentRepository;
    @Autowired private ContentRightsRepository contentRightsRepository;
    @Autowired private UsageTransactionRepository usageTransactionRepository;
    @Autowired private RoyaltyCalculationRepository royaltyCalculationRepository;
    @Autowired private RoyaltyPaymentRepository royaltyPaymentRepository;
    @Autowired private RightsTransferRepository rightsTransferRepository;

    @Override
    public void run(String... args) {
        
        if (userRepository.count() > 0) {
            System.out.println("[DataInitializer] Data already exists — skipping seed.");
            return;
        }

        System.out.println("[DataInitializer] Seeding mock data...");

        
        User admin = userRepository.save(User.builder()
                .name("Super Admin")
                .email("admin@creatorfund.com")
                .password(org.mindrot.jbcrypt.BCrypt.hashpw("admin123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .organizationName("CreatorFund HQ")
                .role(User.Role.ADMIN)
                .build());

        User alice = userRepository.save(User.builder()
                .name("Alice Sharma")
                .email("alice@creatorfund.com")
                .password(org.mindrot.jbcrypt.BCrypt.hashpw("alice123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .organizationName("Alice Studios")
                .role(User.Role.CREATOR)
                .build());

        User bob = userRepository.save(User.builder()
                .name("Bob Kumar")
                .email("bob@creatorfund.com")
                .password(org.mindrot.jbcrypt.BCrypt.hashpw("bob123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .organizationName("Bob Media")
                .role(User.Role.CREATOR)
                .build());

        User rohan = userRepository.save(User.builder()
                .name("Rohan Verma")
                .email("rohan@creatorfund.com")
                .password(org.mindrot.jbcrypt.BCrypt.hashpw("rohan123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .organizationName("Rohan Distribution Co.")
                .role(User.Role.DISTRIBUTOR)
                .build());

        User priya = userRepository.save(User.builder()
                .name("Priya Nair")
                .email("priya@creatorfund.com")
                .password(org.mindrot.jbcrypt.BCrypt.hashpw("priya123", org.mindrot.jbcrypt.BCrypt.gensalt()))
                .organizationName("Priya Media Pvt Ltd")
                .role(User.Role.DISTRIBUTOR)
                .build());

        System.out.println("[DataInitializer] Users created.");

        
        DigitalContent c1 = digitalContentRepository.save(DigitalContent.builder()
                .title("Learn React Hooks")
                .contentType(DigitalContent.ContentType.COURSE)
                .description("A comprehensive course on React Hooks from basics to advanced patterns.")
                .contentStatus(DigitalContent.ContentStatus.ACTIVE)
                .price(new BigDecimal("999.00"))
                .salesCount(47)
                .targetQty(100)
                .createdBy(alice)
                .publishedDate(LocalDateTime.of(2023, 3, 15, 9, 0))
                .build());

        DigitalContent c2 = digitalContentRepository.save(DigitalContent.builder()
                .title("Tech Review Video - iPhone 16")
                .contentType(DigitalContent.ContentType.VIDEO)
                .description("In-depth review of the iPhone 16 covering hardware, software, and camera quality.")
                .contentStatus(DigitalContent.ContentStatus.ACTIVE)
                .price(new BigDecimal("499.00"))
                .salesCount(102)
                .targetQty(200)
                .createdBy(bob)
                .publishedDate(LocalDateTime.of(2023, 10, 1, 10, 0))
                .build());

        DigitalContent c3 = digitalContentRepository.save(DigitalContent.builder()
                .title("Lo-Fi Beats Vol. 1")
                .contentType(DigitalContent.ContentType.MUSIC)
                .description("A relaxing lo-fi music collection for focus and study sessions.")
                .contentStatus(DigitalContent.ContentStatus.ACTIVE)
                .price(new BigDecimal("199.00"))
                .salesCount(285)
                .targetQty(500)
                .createdBy(alice)
                .publishedDate(LocalDateTime.of(2023, 7, 20, 8, 0))
                .build());

        DigitalContent c4 = digitalContentRepository.save(DigitalContent.builder()
                .title("Frontend Basics for Beginners")
                .contentType(DigitalContent.ContentType.ARTICLE)
                .description("A detailed article covering HTML, CSS, and JavaScript fundamentals.")
                .contentStatus(DigitalContent.ContentStatus.DRAFT)
                .price(new BigDecimal("99.00"))
                .salesCount(0)
                .targetQty(50)
                .createdBy(alice)
                .build());

        DigitalContent c5 = digitalContentRepository.save(DigitalContent.builder()
                .title("Startup Podcast - Episode 12")
                .contentType(DigitalContent.ContentType.PODCAST)
                .description("Interviews with top startup founders sharing their journey to success.")
                .contentStatus(DigitalContent.ContentStatus.ACTIVE)
                .price(new BigDecimal("149.00"))
                .salesCount(65)
                .targetQty(150)
                .createdBy(bob)
                .publishedDate(LocalDateTime.of(2023, 9, 5, 11, 0))
                .build());

        System.out.println("[DataInitializer] Digital content created.");

        
        contentRightsRepository.saveAll(List.of(
                ContentRights.builder()
                        .digitalContent(c1).rightsOwner(alice)
                        .ownershipPercentage(new BigDecimal("100.00"))
                        .rightsStartDate(LocalDateTime.of(2023, 3, 15, 0, 0))
                        .rightsEndDate(LocalDateTime.of(2023, 3, 15, 0, 0).plusYears(1))
                        .rightsStatus(ContentRights.RightsStatus.ACTIVE).build(),

                ContentRights.builder()
                        .digitalContent(c2).rightsOwner(bob)
                        .ownershipPercentage(new BigDecimal("100.00"))
                        .rightsStartDate(LocalDateTime.of(2023, 10, 1, 0, 0))
                        .rightsEndDate(LocalDateTime.of(2023, 10, 1, 0, 0).plusYears(1))
                        .rightsStatus(ContentRights.RightsStatus.ACTIVE).build(),

                ContentRights.builder()
                        .digitalContent(c3).rightsOwner(alice)
                        .ownershipPercentage(new BigDecimal("100.00"))
                        .rightsStartDate(LocalDateTime.of(2023, 7, 20, 0, 0))
                        .rightsEndDate(LocalDateTime.of(2023, 7, 20, 0, 0).plusYears(1))
                        .rightsStatus(ContentRights.RightsStatus.ACTIVE).build(),

                ContentRights.builder()
                        .digitalContent(c4).rightsOwner(alice)
                        .ownershipPercentage(new BigDecimal("100.00"))
                        .rightsStartDate(LocalDateTime.of(2024, 1, 1, 0, 0))
                        .rightsEndDate(LocalDateTime.of(2024, 1, 1, 0, 0).plusYears(1))
                        .rightsStatus(ContentRights.RightsStatus.ACTIVE).build(),

                ContentRights.builder()
                        .digitalContent(c5).rightsOwner(bob)
                        .ownershipPercentage(new BigDecimal("100.00"))
                        .rightsStartDate(LocalDateTime.of(2023, 9, 5, 0, 0))
                        .rightsEndDate(LocalDateTime.of(2023, 9, 5, 0, 0).plusYears(1))
                        .rightsStatus(ContentRights.RightsStatus.ACTIVE).build()
        ));

        System.out.println("[DataInitializer] Content rights created.");

        
        List<UsageTransaction> transactions = usageTransactionRepository.saveAll(List.of(
                UsageTransaction.builder()
                        .digitalContent(c1).distributor(rohan)
                        .usageType(UsageTransaction.UsageType.DOWNLOAD)
                        .usageCount(1).revenueGenerated(new BigDecimal("999.00"))
                        .transactionStatus(UsageTransaction.TransactionStatus.SETTLED)
                        .licenseKey("LIC-A1B2-C3D4").build(),

                UsageTransaction.builder()
                        .digitalContent(c2).distributor(rohan)
                        .usageType(UsageTransaction.UsageType.DOWNLOAD)
                        .usageCount(1).revenueGenerated(new BigDecimal("499.00"))
                        .transactionStatus(UsageTransaction.TransactionStatus.SETTLED)
                        .licenseKey("LIC-E5F6-G7H8").build(),

                UsageTransaction.builder()
                        .digitalContent(c3).distributor(priya)
                        .usageType(UsageTransaction.UsageType.STREAM)
                        .usageCount(5).revenueGenerated(new BigDecimal("995.00"))
                        .transactionStatus(UsageTransaction.TransactionStatus.VERIFIED)
                        .licenseKey("LIC-I9J0-K1L2").build(),

                UsageTransaction.builder()
                        .digitalContent(c5).distributor(priya)
                        .usageType(UsageTransaction.UsageType.SUBSCRIPTION_ACCESS)
                        .usageCount(1).revenueGenerated(new BigDecimal("149.00"))
                        .transactionStatus(UsageTransaction.TransactionStatus.RECORDED)
                        .licenseKey("LIC-M3N4-O5P6").build()
        ));

        System.out.println("[DataInitializer] Usage transactions created.");

        
        RoyaltyCalculation rc1 = royaltyCalculationRepository.save(RoyaltyCalculation.builder()
                .digitalContent(c1)
                .royaltyOwner(alice)
                .totalRevenue(new BigDecimal("999.00"))
                .royaltyPercentage(new BigDecimal("70.00"))
                .calculatedAmount(new BigDecimal("699.30"))
                .calculationDate(LocalDateTime.of(2023, 11, 1, 0, 0))
                .calculationStatus(RoyaltyCalculation.CalculationStatus.APPROVED)
                .build());

        RoyaltyCalculation rc2 = royaltyCalculationRepository.save(RoyaltyCalculation.builder()
                .digitalContent(c2)
                .royaltyOwner(bob)
                .totalRevenue(new BigDecimal("499.00"))
                .royaltyPercentage(new BigDecimal("70.00"))
                .calculatedAmount(new BigDecimal("349.30"))
                .calculationDate(LocalDateTime.of(2023, 11, 1, 0, 0))
                .calculationStatus(RoyaltyCalculation.CalculationStatus.CALCULATED)
                .build());

        System.out.println("[DataInitializer] Royalty calculations created.");

        
        royaltyPaymentRepository.saveAll(List.of(
                RoyaltyPayment.builder()
                        .royaltyCalculation(rc1)
                        .paidAmount(new BigDecimal("699.30"))
                        .paymentDate(LocalDateTime.of(2023, 11, 15, 12, 0))
                        .paymentReference("PAY-REF-2023-001")
                        .paymentStatus(RoyaltyPayment.PaymentStatus.SUCCESS)
                        .build(),

                RoyaltyPayment.builder()
                        .royaltyCalculation(rc2)
                        .paidAmount(new BigDecimal("349.30"))
                        .paymentDate(LocalDateTime.of(2023, 11, 20, 12, 0))
                        .paymentReference("PAY-REF-2023-002")
                        .paymentStatus(RoyaltyPayment.PaymentStatus.INITIATED)
                        .build()
        ));

        System.out.println("[DataInitializer] Royalty payments created.");

        
        rightsTransferRepository.save(RightsTransfer.builder()
                .digitalContent(c3)
                .previousOwner(alice)
                .newOwner(bob)
                .transferDate(LocalDateTime.of(2024, 1, 1, 0, 0))
                .transferPercentage(new BigDecimal("30.00"))
                .build());

        System.out.println("[DataInitializer] Rights transfer created.");
        System.out.println("[DataInitializer] ✅ All mock data seeded successfully!");
    }
}
