package com.roa.rotp.common.repository;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.roa.rotp.admin.dto.AuditLogSearchRequest;
import com.roa.rotp.common.entity.AuditLog;
import com.roa.rotp.common.entity.QAuditLog;
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

        // selectbox 선택된 필드에만 keyword 적용
        if (request.keyword() != null && !request.keyword().isBlank()) {
            String likePattern = "%" + request.keyword() + "%";

            PathBuilder<AuditLog> entityPath = new PathBuilder<>(AuditLog.class, "auditLog");
            builder.and(entityPath.getString(request.field()).like(likePattern));
        }

        if (request.httpMethod() != null) builder.and(auditLog.httpMethod.eq(request.httpMethod()));

        // 기간 조건
        if (request.startDate() != null) builder.and(auditLog.createdAt.goe(request.startDate()));
        if (request.endDate() != null) builder.and(auditLog.createdAt.loe(request.endDate()));

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

    private boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}
