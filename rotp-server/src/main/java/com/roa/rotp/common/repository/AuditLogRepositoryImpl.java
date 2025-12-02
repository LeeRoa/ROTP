package com.roa.rotp.common.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.roa.rotp.admin.dto.audit.AuditLogSearchRequest;
import com.roa.rotp.common.entity.AuditLog;
import com.roa.rotp.common.entity.QAuditLog;
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
public class AuditLogRepositoryImpl implements CustomAuditLogRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<AuditLog> search(AuditLogSearchRequest request, Pageable pageable) {
        QAuditLog auditLog = QAuditLog.auditLog;
        BooleanBuilder builder = new BooleanBuilder();

        PathBuilder<AuditLog> entityPath = new PathBuilder<>(AuditLog.class, "auditLog");
        QuerydslPredicateUtils.keywordSearch(builder, entityPath, request.keyword(), request.field());
        QuerydslPredicateUtils.eq(builder, auditLog.httpMethod, request.httpMethod());
        QuerydslPredicateUtils.between(builder, auditLog.createdAt, request.startDate(), request.endDate());

        // 데이터 조회
        List<AuditLog> content = queryFactory
                .selectFrom(auditLog)
                .where(builder)
                .orderBy(auditLog.createdAt.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();


        // 전체 카운트 조회
        long total = Optional.ofNullable(
                queryFactory.select(auditLog.count())
                        .from(auditLog)
                        .where(builder)
                        .fetchOne()
        ).orElse(0L);

        return new PageImpl<>(content, pageable, total);
    }
}
