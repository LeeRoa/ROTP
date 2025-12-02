package com.roa.rotp.core.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.roa.rotp.admin.dto.adminaccount.AdminAccountSearchRequest;
import com.roa.rotp.admin.entity.AdminAccount;
import com.roa.rotp.admin.entity.QAdminAccount;
import com.roa.rotp.admin.repository.CustomAdminAccountRepository;
import com.roa.rotp.common.util.QuerydslPredicateUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdminAccountRepositoryImpl implements CustomAdminAccountRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<AdminAccount> search(AdminAccountSearchRequest request, Pageable pageable) {
        QAdminAccount adminAccount = QAdminAccount.adminAccount;
        BooleanBuilder builder = new BooleanBuilder();

        PathBuilder<AdminAccount> entityPath = new PathBuilder<>(AdminAccount.class, "adminAccount");
        QuerydslPredicateUtils.keywordSearch(builder, entityPath, request.field(), request.keyword());
        QuerydslPredicateUtils.eq(builder, adminAccount.role, request.role());
        QuerydslPredicateUtils.eq(builder, adminAccount.enabled, request.enabled());
        QuerydslPredicateUtils.between(builder, adminAccount.createdAt, request.startDate(), request.endDate());


        List<AdminAccount> contents = queryFactory
                .selectFrom(adminAccount)
                .where(builder)
                .orderBy(adminAccount.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = Optional.ofNullable(
                queryFactory.select(adminAccount.count())
                        .from(adminAccount)
                        .where(builder)
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(contents, pageable, total);
    }
}
